// Supabase Auth Helper
// Replace these with your own Supabase credentials
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Wait for Supabase library to load
let supabaseClient = null;

// Get or create Supabase client
function getSupabase() {
    if (supabaseClient) return supabaseClient;

    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded yet');
        return null;
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
}

// Auth state management
window.getCurrentUser = async function() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

window.signInWithMagicLink = async function(email) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Update this to your domain
            emailRedirectTo = 'https://your-domain.com/feed.html'
        }
    });

    if (error) throw error;
    return data;
}

window.signOut = async function() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
}

// Auth guard - redirects to join if not authenticated
window.requireAuth = async function() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = '/join.html';
        return null;
    }
    return user;
}

// Listen for auth state changes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

function initAuth() {
    const supabase = getSupabase();
    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, session);

            if (event === 'SIGNED_IN') {
                console.log('User signed in:', session.user.email);
            }

            if (event === 'SIGNED_OUT') {
                console.log('User signed out');
            }
        });
    }
}
