
# Create your views here.
from django.shortcuts import render
import pyrebase
from rest_framework.response import Response
from rest_framework.views import APIView
 
config={
    "apiKey": "AIzaSyBsl0qnXYOFjFaB_Exh_dylbK5ojEUjDFo",
    "authDomain": "tester-d9eae.firebaseapp.com",
    "projectId": "tester-d9eae",
    "storageBucket": "tester-d9eae.appspot.com",
    "messagingSenderId": "786707515068",
    "appId": "1:786707515068:web:13c4ff861c4b529efcb2b9",
    "databaseURL": "https://tester-d9eae-default-rtdb.firebaseio.com/"
}
firebase=pyrebase.initialize_app(config)
authe = firebase.auth()
database=firebase.database()
 
class MyView(APIView):
    def get(self,request):
        day = database.child('Data').child('Day').get().val()
        id = database.child('Data').child('id').get().val()
        projectname = database.child('Data').child('Project Name').get().val()

        data = {
            "day" : day,
            "id" : id,
            "projectname" : projectname
        }
        return Response(data)
