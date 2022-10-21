const Sauce = require('../models/sauce');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,

    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, 
  });   
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};


exports.modifySauce = (req, res) => {

  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body }

  Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
      .then(res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => res.status(400).json({ error }))
};



exports.deleteSauce =  (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
   
   if (req.body.like == 1 && !sauce.usersLiked.includes(req.body.userId)) {
     Sauce.updateOne(
       { _id: req.params.id },
       {
         $inc: { likes: +1 }, 
         $push: { usersLiked: req.body.userId },
       }
     )
       .then(() => res.status(200).json({ message: "Sauce liké !" }))
       .catch((error) => res.status(400).json({ error }));
   } else if (
     req.body.like == - 1 &&
     !sauce.usersDisliked.includes(req.body.userId)
   ) {
     Sauce.updateOne(
       { _id: req.params.id },
       {
         $inc: { dislikes: +1 },
         $push: { usersDisliked: req.body.userId },
       }
     )
       .then(() => res.status(200).json({ message: "Sauce dislike !" }))
       .catch((error) => res.status(400).json({ error }));
   } else {
     if (sauce.usersDisliked.includes(req.body.userId)) {
       console.log('nickel');
       Sauce.updateOne(
         { _id: req.params.id },
         {
           $inc: { dislikes: -1 },
           $pull: { usersDisliked: req.body.userId },
         }
       )
         .then(() => res.status(200).json({ message: "Dislike canceled !" }))
         .catch((error) => res.status(400).json({ error }));
     } else if (sauce.usersLiked.includes(req.body.userId)) {
       console.log('ok');
       Sauce.updateOne(
         { _id: req.params.id },
         {
           $inc: { likes: - 1 },
           $pull: { usersLiked: req.body.userId },
         }
       )
         .then(() => res.status(200).json({ message: "LIKE CANCELED !" }))
         .catch((error) => res.status(400).json({ error }));
     }
   }
 });
};


