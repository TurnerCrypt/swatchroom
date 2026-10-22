import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const previewRequests=sqliteTable('preview_requests',{
 id:text('id').primaryKey(),
 client:text('client').notNull(),
 createdAt:integer('created_at').notNull()
},table=>[index('preview_client_time').on(table.client,table.createdAt),index('preview_time').on(table.createdAt)]);
