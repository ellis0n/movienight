import { db } from "astro:db";
import { eq, ViewersDB } from "astro:db";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { ViewerResponse } from "src/types/viewers";
    
export const auth = {
    getUser: defineAction({
        input: z.object({
            clerkId: z.string(),
        }),
        handler: async ({ clerkId }): Promise<ViewerResponse> => {
            try {
                const getUser = await db
                    .select()
                    .from(ViewersDB)
                    .where(eq(ViewersDB.clerkId, clerkId))
                    .run();

                if (!getUser.rows[0]) {
                    return {
                        viewer: null,
                        isAdmin: false,
                        error: "User not found"
                    };
                }

                const viewer = getUser.rows[0];
                return {
                    viewer: {
                        id: Number(viewer.id),
                        _id: String(viewer._id),
                        name: String(viewer.name),
                        clerkId: String(viewer.clerkId),
                        discordId: viewer.discordId ? String(viewer.discordId) : undefined,
                        discordUsername: viewer.discordUsername ? String(viewer.discordUsername) : undefined,
                        color: String(viewer.color),
                        avatar: viewer.avatar ? String(viewer.avatar) : undefined,
                        isAdmin: Boolean(viewer.isAdmin),
                        bio: viewer.bio ? String(viewer.bio) : undefined,
                        ratings: [],
                        pickedList: []
                    },
                    isAdmin: Boolean(viewer.isAdmin),
                    error: null
                };
            } catch (error) {
                console.error('Error fetching user:', error);
                return {
                    viewer: null,
                    isAdmin: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        },
    })
};
