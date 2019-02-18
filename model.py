import tensorflow as tf
import numpy as np
import math
import tensorflowjs as tfjs

import cv2
import os
import glob

from PIL import Image

from tensorflow.python import keras
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import InputLayer, Input
from tensorflow.python.keras.layers import Reshape, MaxPooling2D
from tensorflow.python.keras.layers import Conv2D, Dense, Flatten
from tensorflow.python.keras.models import load_model


img_dir_train = "/home/srija/tensorflow/head_pose_13/train" # Directory of all train images 
img_dir_test = "/home/srija/tensorflow/head_pose_13/test" # Directory of all test images 

data_path_train = os.path.join(img_dir_train,'*g')
data_path_test = os.path.join(img_dir_test,'*g')

num_train = 960
num_test = 72

img_dim = 64 #each input image will be of size 64x64
num_persons = 12
num_each_train = 80 #number of training images for each person
num_each_test = 6  #number of test images for each person

files = glob.glob(data_path_train)
count = 0
data = []
for f1 in sorted(files):
    image = cv2.imread(f1)
    img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (img_dim,img_dim))
    data.append(img)

train_data = data
train_data = np.array(train_data)
print(train_data.shape)
train_data = np.reshape(train_data, (num_train, img_dim,img_dim))
print(train_data.shape)


files = glob.glob(data_path_test)
data = []
count = 0
for f1 in sorted(files):
    count = count+1
    image = cv2.imread(f1)
    img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (img_dim,img_dim))
    strName = "/home/srija/tensorflow/head_pose_13/formed_images/img_" + str(count) + ".png"
    cv2.imwrite(strName, img)
    data.append(img)
    
test_data = data
test_data = np.array(test_data)
test_data = np.reshape(test_data, (num_test, img_dim,img_dim))
print(test_data.shape)

y = np.random.randint(2, size = (num_train,1))
for i in range(num_persons):
    for j in range(i*num_each_train, (i+1)*num_each_train):
        y[j] = i
print(y.shape)
train_labels = keras.utils.to_categorical(y, num_classes=num_persons)
print(train_labels.shape)


y = np.random.randint(2, size = (num_test,1))
for i in range(num_persons):
    for j in range(i*num_each_test, (i+1)*num_each_test):
        y[j] = i
test_labels = keras.utils.to_categorical(y, num_classes=num_persons)

print("Size of:")
print("- Training-set:\t\t{}".format(len(train_data)))
print("- Test-set:\t{}".format(len(test_data)))
print("- Train-labels:\t\t{}".format(len(train_labels)))
print("- Test-labels:\t\t{}".format(len(test_labels)))



img_size = img_dim


# The images are stored in one-dimensional arrays of this length.
img_size_flat = img_size*img_size

# Tuple with height and width of images used to reshape arrays.
img_shape = (img_size, img_size)

img_shape_full = (img_size, img_size, 1)

# 1 for grayscale
num_channels = 1

# Number of classes, one class for each of 12 persons.
num_classes = 12

model = Sequential()

model.add(InputLayer(input_shape = (img_dim, img_dim)))

model.add(Reshape(img_shape_full))

model.add(Conv2D(kernel_size = 5, strides = 1, filters = 16, padding = "same",
            activation = "relu", name = "conv_layer_1"))

model.add(MaxPooling2D(pool_size = 2, strides = 2))

model.add(Conv2D(kernel_size = 5, strides = 1, filters = 36, padding = "same",
            activation = "relu", name = "conv_layer_2"))

model.add(MaxPooling2D(pool_size = 2, strides = 2))

model.add(Conv2D(kernel_size = 5, strides = 1, filters = 56, padding = "same",
            activation = "relu", name = "conv_layer_3"))

model.add(MaxPooling2D(pool_size = 2, strides = 2))

model.add(Conv2D(kernel_size = 5, strides = 1, filters = 80, padding = "same",
            activation = "relu", name = "conv_layer_4"))

model.add(MaxPooling2D(pool_size = 2, strides = 2))

model.add(Conv2D(kernel_size = 5, strides = 1, filters = 80, padding = "same",
            activation = "relu", name = "conv_layer_5"))

model.add(MaxPooling2D(pool_size = 2, strides = 2))

model.add(Flatten())

model.add(Dense(128, activation = "relu"))

model.add(Dense(num_classes, activation = "softmax"))

print(model.summary())


from tensorflow.python.keras.optimizers import Adam

optimizer = Adam(lr = 1e-3)

model.compile(optimizer = optimizer,
                loss = 'categorical_crossentropy',
                metrics = ["accuracy"])

model.fit(x = train_data,
            y = train_labels,
            epochs = 30, batch_size = 200)


result = model.evaluate(x = test_data,
                        y = test_labels)



for name,value in zip(model.metrics_names, result):
    print(name, value)

print("{0}: {1:.2}".format(model.metrics_names[1], result[1]))
    

path_model = 'model.keras'

tfjs.converters.save_keras_model(model, '/home/srija/tensorflow/head_pose_13/tfjs/public/models/myModel')
model.save(path_model)


print(model.summary())
