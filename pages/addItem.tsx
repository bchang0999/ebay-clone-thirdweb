import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { FormEvent, use, useState } from "react";
import Header from "../components/Header";

function addItem() {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const mintNFT = async (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    if (!contract || !address) return;

    if(!image){
      alert('Please Select An Image')
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string}
      description: { value: string};
    }

    const metaData = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    }

    try{
      const tx = await contract.mintTo(address, metaData)

      const receipt = tx.receipt; // the transaction receipt
      const tokenId =tx.id; //the id of the NFT minted
      const nft = await tx.data();

      console.log(receipt,tokenId,nft);
      router.push('/');
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you're essentially Minitng an
          NFT of the item into you wallet which we can sale!
        </p>

        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt=""
          />

          <form onSubmit={mintNFT} className="flex flex-col flex-1 p-2 space-y-2">
            <label className="font-light">Name of item</label>
            <input
              className="formField"
              type="text"
              placeholder="Name of item..."
              name="name"
              id="name"
            />

            <label className="font-light">Description</label>
            <input
              className="formField"
              type="text"
              placeholder="Enter Description"
              name="description"
              id="description"
            />

            <label className="font-light">
              Image of the Item
            </label>
            <input type="file" onChange={e=> {
                if (e.target.files?.[0]){
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
            }} />

            <button type="submit" className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 md:mt-auto mx-auto md:ml-auto">Add/Mint Item</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
