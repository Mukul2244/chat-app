import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {}, handler: async (ctx, _) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });
        if (!currentUser) {
            throw new ConvexError("User not found");
        }
        // with this we get an array of all the conversations that the user is a member of
        const conversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id)).collect();

        const conversations = await Promise.all(conversationMemberships?.map(async (conv) => {
            const conversation = await ctx.db.get(conv.conversationId);
            if (!conversation) {
                throw new ConvexError("Conversation could not be found");
            }
            return conversation;
        }))
        const conversationsWithDetails = await Promise.all(conversations?.map(async (c) => {
            const conversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", (q) => q.eq("conversationId", c?._id)).collect();

            if (c.isGroup) {
                return { c };
            } else {
                const otherMemberships = conversationMemberships?.filter((m) => m.memberId !== currentUser._id)[0];
                const otherMember = await ctx.db.get(otherMemberships?.memberId);
                return { c, otherMember };
            }
        }))

        return conversationsWithDetails;
    }
});