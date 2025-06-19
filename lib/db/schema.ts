import {pgTable , text , uuid , integer , boolean , timestamp} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { Children } from "react"

export const files = pgTable("files" , {
    id : uuid("id").defaultRandom().primaryKey() , 

    // basic file as well as folder information , 
    name : text("name").notNull() , 
    path: text("path").notNull() ,  // this is going to be /document/project/resume
    size: integer("size").notNull() ,
    type: text("type").notNull() , // file or a folder

    // storage information
    fileUrl: text("file_url").notNull() , // url to access the file 
    thumbnailUrl: text("thumbnail_url") , 

    // Ownership information 
    userId: text("user_id").notNull() , 
    parentId: uuid("parent_id"), // Parent folder id (null for the root items)

    // file/ folder flags 
    isFolder: boolean("is_folder").default(false).notNull() , 
    isStarred: boolean("is_starred").default(false).notNull() , 
    isTrash: boolean("is_trash").default(false).notNull() , 

    // Timestap , missing mongo db here , shit 
    createdAt : timestamp("created_at").defaultNow().notNull() , 
    updatedAt: timestamp("updated_at").defaultNow().notNull() , 
})


/*
Parent : Each file/folder can have one parent folder 
Children : Each folder can have many child , which can be files/folders
*/



export const filesRelations = relations(files , ({one , many}) =>({
    parent: one(files , {
        fields : [files.parentId] , 
        references : [files.id]
    }),

    // relationship to child files/folder
    children: many(files)
}))


// Type definations 
// super power of drizzle 

export const File = typeof files.$inferSelect