import { Flavour } from "@/types";  

const URL = `${process.env.NEXT_PUBLIC_API_URL}/flavours`;   

const getFlavours = async (): Promise<Flavour[]> => {
    const res = await fetch(URL) 

    return res.json();
}; 

export default getFlavours; 
