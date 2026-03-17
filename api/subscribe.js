import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  // Validate inputs
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name required' });
  }

  try {
    // If GitHub token is configured, save to repo
    if (process.env.GITHUB_TOKEN) {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

      const owner = 'your-github-username';
      const repo = 'your-repo-name';
      const path = 'data/emails.csv';

      // Get current file content
      let currentContent = '';
      let sha = null;

      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });
        currentContent = Buffer.from(data.content, 'base64').toString();
        sha = data.sha;
      } catch (error) {
        // File doesn't exist yet, that's ok
        currentContent = 'name,email,timestamp\n';
      }

      // Append new subscriber
      const timestamp = new Date().toISOString();
      const newLine = `"${name}",${email},${timestamp}\n`;
      const updatedContent = currentContent + newLine;

      // Commit to repo
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Add subscriber: ${name} (${email})`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha,
      });
    }

    // Log to Vercel logs (always available)
    console.log('New subscriber:', name, email, new Date().toISOString());

    return res.status(200).json({
      success: true,
      message: 'Thanks for subscribing!'
    });

  } catch (error) {
    console.error('Subscription error:', error);

    // Still return success to user even if save fails
    // They'll still get the download
    return res.status(200).json({
      success: true,
      message: 'Thanks for subscribing!'
    });
  }
}
