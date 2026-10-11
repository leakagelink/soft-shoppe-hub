import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/lib/catalogue';
import {LegalPage} from '@/components/legal-page';
import {SUPPORT_EMAIL} from '@/lib/site';
export const Route=createFileRoute('/shipping-policy')({head:()=>pageHead('Shipping & delivery','Where Nanhaa delivers, delivery times, shipping charges and COD availability.'),component:()=><LegalPage title="Shipping & delivery" intro="Nanhaa ships within India." sections={[
['Serviceability',['Enter your PIN code on a product page or at checkout to check delivery. Some PIN codes may not be serviceable or COD-eligible.']],
['Delivery time',['Delivery estimates shown are indicative (typically 3–7 working days) and may vary by location, supplier and courier. Some items ship directly from approved suppliers.']],
['Shipping charges',['Any shipping charge is shown in your bag and at checkout before you place the order. Free-shipping thresholds, when offered, are shown in the bag.']],
['Tracking',['Order status and tracking details, when available, appear on your order page and in notifications.']],
['Help',[`Email ${SUPPORT_EMAIL} with your order ID.`]]]}/>});
