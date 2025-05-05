import Book from "@/models/BookSchema";
import { NextRequest,NextResponse } from "next/server";
import {Donation} from "@/models/model"
export async function POST(req : NextRequest){
    try{
        const userid = req.headers.get("userid");
        const formData = await req.formData();
        const bookid = formData.get('bookid');
        const donorid = formData.get('donorid');
        const book = await Book.findById({
            _id: bookid
        })
        if(!bookid){
            return NextResponse.json({message:"Book not found"}, {status:404});
        }
        if(book.status==="Not Available"){
            return NextResponse.json({message:"Book not available"}, {status:400});
        }

        const donation = await Donation.create({
            bookid: bookid,
            userId: userid,
            donorId : donorid
        });
        

        await donation.save();
        book.status = "Not Available";
        await book.save();
        return NextResponse.json({message:"Book requested successfully"}, {status:200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message:"Internal server error"}, {status:500});
    }
}