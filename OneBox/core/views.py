from django.shortcuts import render
from django.contrib.auth.models import User
# Core
from .serializer import *
from .models import File,Folder
# Restframework
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.http import Http404, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework import authentication, permissions
# Create your views here.


# User Create View
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

# File Create View
class FileCreateView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [AllowAny]
    

# File Delete View
class FileDeleteView(generics.DestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'
    
    
# File Search View
class FilesSearchView(generics.ListAPIView):
    serializer_class = FileSerializer

    def get_queryset(self):
        search_name = self.kwargs['search']
        return File.objects.filter(file_name__icontains=search_name)
    
    
# File Api View
class FileView(APIView):
    
    def get(self, request):
        file = File.objects.filter(user=request.user)
        serializer = FileSerializer(file, many=True)
        return Response(serializer.data, status.HTTP_200_OK)



# Folder Create View
class FolderCreateView(generics.CreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
# Folder Model Api View
class FolderView(APIView):

    def get(self, request, format=None):
        folder = Folder.objects.all()
        serializer = FolderSerializer(folder)
        return Response(serializer.data)
