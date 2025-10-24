import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {
        id: v.id("conversations")
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });
        if (!currentUser) {
            throw new ConvexError("User not found");
        }
        const conversation = await ctx.db.get(args.id);
        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }
        const membership = await ctx.db.query("conversationMembers").withIndex("by_conversationId_memberId", (q) => q.eq("conversationId", conversation._id).eq("memberId", currentUser._id)).unique();
        if (!membership) {
            throw new ConvexError("You are not a member of this conversation");
        }
        const allMembershipDetails = await ctx.db.query('conversationMembers').withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id)).collect();

        if (!conversation.isGroup) {
            const otherMembership = allMembershipDetails?.filter((m) => m.memberId !== currentUser._id)[0];
            const otherMember = await ctx.db.get(otherMembership?.memberId);
            if (!otherMember) {
                throw new ConvexError("Other member not found");
            }
            return {
                ...conversation,
                otherMember: {
                    ...otherMember,
                    lastSeenMessageId: otherMembership.lastSeenMessage
                },
                otherMembers: null
            };
        } else {
            const otherMembers = await Promise.all(allMembershipDetails.filter((m) => m.memberId !== currentUser._id).map(async (membership) => {
                const member = await ctx.db.get(membership.memberId);
                if (!member) {
                    throw new ConvexError("Member could not be found");
                }
                return {
                    username: member.username,
                    // imageUrl : member.imageUrl,
                    // email : member.email,
                }
            }));
            return {
                ...conversation,
                otherMembers,
                otherMember: null
            }
        }
    }
});

export const deleteGroup = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });
        if (!currentUser) {
            throw new ConvexError("User not found");
        }
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }
        const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect();
        if (!memberships || memberships.length <= 1) {
            throw new ConvexError("This conversation does not have any members");
        }
        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect();

        await ctx.db.delete(args.conversationId);
        await Promise.all(memberships.map(async (membership) => {
            await ctx.db.delete(membership._id);
        }))
        await Promise.all(messages.map(async (message) => {
            await ctx.db.delete(message._id);
        }))
    }
})

export const leaveGroup = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });
        if (!currentUser) {
            throw new ConvexError("User not found");
        }
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }
        const membership = await ctx.db.query("conversationMembers").withIndex("by_conversationId_memberId", q => q.eq("conversationId", args.conversationId).eq("memberId", currentUser._id)).unique();
        if (!membership) {
            throw new ConvexError("You are not a member of this conversation");
        }
        const members = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect();
        if (!members || members.length === 1) {
            throw new ConvexError("You are the only member of this conversation");
        }
        await ctx.db.delete(membership._id);


    }
})