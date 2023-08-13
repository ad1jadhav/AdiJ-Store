"use client";

import React, { useState } from 'react';



import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const onCheckout = async () => {
    if(phone.length < 10 || phone.length > 10){
      toast.error('Please add Phone');
      return false
    }
    if(address.length <=5){
      toast.error('Please add Shipping Address');
      return false;
    }

    setIsLoading(true)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      productIds: items.map((item) => item.id),
      address: address,
      phone: phone
    }).then(function (response) {
        toast.success('Order Placed. We will contact you for confirmation.');
        setIsLoading(false)
        window.location = response.data.url;
        removeAll();
    }).catch(function (error) {
        toast.error('Something went wrong.');
        setIsLoading(false)
    });
  }


  return (
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >



      <div className="bg-white rounded-lg shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
        <div className="px-4 py-8 sm:px-10">
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300">
              </div>
            </div>
            <div className="relative flex justify-center text-sm leading-5">
              <span className="px-2 text-lg font-medium text-gray-900 bg-white">
                Shipping Details
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full space-y-6">
              <div className="w-full">
                <div className=" relative ">
                  <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" className=" rounded-lg border flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Phone" />
                </div>
              </div>
              <div className="w-full">
                <div className=" relative ">
                  <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} name="address" className=" rounded-lg border flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Address" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>





      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button disabled={items.length === 0} onClick={onCheckout} className="w-full mt-6 flex justify-center items-center">
        <span className='font-medium'>Place Order</span>
        {
          isLoading && (
            <div className='lds-dual-ring mb-3 ml-2 pb-1'></div> 
          )
        }
      </Button>
    </div>
  );
}

export default Summary; 