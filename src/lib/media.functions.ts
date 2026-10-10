import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
export const uploadProductPhoto=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input)=>z.object({productId:z.string().regex(/^[a-z0-9-]{1,100}$/),base64:z.string().min(16).max(6990520),type:z.enum(['image/jpeg','image/png','image/webp'])}).parse(input)).handler(async({data,context})=>{
 const check=await context.supabase.rpc('staff_has_role',{allowed:['owner','admin','catalogue']});if(check.error||!check.data)throw new Error('Catalogue staff access required');
 let bytes:Uint8Array;try{bytes=Uint8Array.from(atob(data.base64),c=>c.charCodeAt(0))}catch{throw new Error('Invalid image')}
 if(bytes.length>5*1024*1024)throw new Error('Image must be smaller than 5 MB');
 const valid=data.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:data.type==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10:bytes[0]===82&&bytes[1]===73&&bytes[2]===70&&bytes[3]===70&&bytes[8]===87&&bytes[9]===69&&bytes[10]===66&&bytes[11]===80;
 if(!valid)throw new Error('Unsupported image contents');
 const product=await context.supabase.from('products').select('id').eq('id',data.productId).single();if(product.error)throw new Error('Product unavailable');
 const path=`${data.productId}/${crypto.randomUUID()}.${data.type==='image/jpeg'?'jpg':data.type==='image/png'?'png':'webp'}`;
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const uploaded=await supabaseAdmin.storage.from('product-images').upload(path,bytes,{contentType:data.type,upsert:false});if(uploaded.error)throw new Error('Image upload failed');
 const inserted=await context.supabase.from('product_images').insert({product_id:data.productId,object_path:path,sort_order:Date.now()%2147483647});if(inserted.error){await supabaseAdmin.storage.from('product-images').remove([path]);throw new Error('Image could not be linked to product')}
 return {ok:true};
});