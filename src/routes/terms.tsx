import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/lib/catalogue';
import {LegalPage} from '@/components/legal-page';
import {SUPPORT_EMAIL,SELLER_NAME,SELLER_ADDRESS,GST_NOTE} from '@/lib/site';
export const Route=createFileRoute('/terms')({head:()=>pageHead('Terms of use','Terms for using the Nanhaa store and app, placing COD orders and writing reviews.'),component:()=><LegalPage title="Terms of use" intro="These terms apply when you browse or buy on Nanhaa. Please read them with our privacy, shipping and refund policies." sections={[
['Eligibility & account',['You must be 18 or older and give accurate details. You are responsible for activity on your account.']],
['Products & prices',['Prices are in Indian Rupees. Product photos are indicative. Prices, offers and stock may change; the final amount is shown at checkout before you confirm. Items marked as samples cannot be ordered.']],
['Orders & payment',['Orders are currently accepted only as Cash on Delivery where available for your PIN code. We may cancel an order for stock, serviceability, pricing errors or suspected misuse, and will inform you.']],
['Coupons',['Coupons have conditions such as minimum order value and validity, cannot be exchanged for cash, and may be withdrawn if misused.']],
['Reviews & content',['Reviews must be honest, from verified purchases, and must not contain abusive, illegal or misleading content. We may remove content that breaks these rules.']],
['Prohibited use',['No fraud, fake orders, scraping, attempts to access other users’ data or admin areas, or interference with the service.']],
['Liability',['To the extent permitted by law, our liability for any order is limited to the amount paid for that order. Nothing limits your rights under the Consumer Protection Act, 2019.']],
['Governing law',['These terms are governed by the laws of India.']],
['Seller details',[`${SELLER_NAME}, ${SELLER_ADDRESS}.`,GST_NOTE]],
['Contact',[`Email ${SUPPORT_EMAIL}.`]]]}/>});
