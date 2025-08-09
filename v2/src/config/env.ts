// Global feature flags and environment config

// Enable testnets across the app. Controlled via CRA env var.
// Set REACT_APP_ENABLE_TESTNET=true to include testnet networks.
export const ENABLE_TESTNET: boolean = (process.env.REACT_APP_ENABLE_TESTNET ?? 'false') === 'true';

