export const lovable = {
  ready: true,
  auth: {
    signInWithOAuth: async (_provider: string, _options?: { redirect_uri?: string }) => ({
      error: null,
      redirected: false,
    }),
  },
};
