import mongoose from "mongoose";

const FavouritesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
},{
    timestamps : true,
})

const Favourites =  mongoose.models.Favourites || mongoose.model('Favourites', FavouritesSchema);

export default Favourites;