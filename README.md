# predict-person
This is a Keras application to predict person(chosen from given test images) from previously learnt model
I have deployed the application using Firebase. To test it on browser-
  1. go to the server directory and run "npm install"
  2. from the same directory run "node server.js"
  
 P.S- Check for the folder structure 
 
 Model.py is the keras implementation which learns the model from the Head Pose Image Dataset. 960 images have been used for training.
 
 72 images(different from training set) have been chosen and user is given the option to select from these using "Previous Image" and "Next Image". The model learnt using "model.py" is imported and stored in browser.
After selecting the image, once an user selects "Predit the Person", the model predicts the person and shows the frontal image of the matched person. 


