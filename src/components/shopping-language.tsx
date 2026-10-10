import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {Languages} from 'lucide-react';
import {Button} from './ui/button';
const Context=createContext({language:'en',setLanguage:(_value:string)=>{},t:(en:string,_hi:string)=>en});
export function ShoppingLanguage({children}:{children:ReactNode}){
 const [language,setLanguage]=useState('en');
 useEffect(()=>{try{if(localStorage.getItem('shopping-language')==='hi')setLanguage('hi')}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=language},[language]);
 return <Context.Provider value={{language,setLanguage:(value)=>{setLanguage(value);try{localStorage.setItem('shopping-language',value)}catch{}},t:(en,hi)=>language==='hi'?hi:en}}>{children}</Context.Provider>;
}
export const useShoppingLanguage=()=>useContext(Context);
export function LanguageSelector(){const {language,setLanguage}=useShoppingLanguage();return <Button variant="ghost" className="h-9 shrink-0 gap-1 px-2 text-xs" aria-label={language==='en'?'Switch shopping language to Hindi':'खरीदारी की भाषा English करें'} onClick={()=>setLanguage(language==='en'?'hi':'en')}><Languages size={16}/>{language==='en'?'हिन्दी':'English'}</Button>;}