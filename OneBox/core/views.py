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
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
# Create your views here.


# User Create View
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

# User Detail View
class UserView(generics.ListAPIView):
    serializer_class = UserSerializer
    
    def get_queryset(self):
        search_name = self.kwargs['ids']
        return User.objects.filter(id__icontains=search_name)
    
# Update User View
class UpdateUserView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserSerializer    

# Profile Detail
class UserProfileView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        search_name = self.kwargs['user']
        return Profile.objects.filter(user=search_name)
    
# Change User Profile Picture
class UserChangeProfileView(APIView):
        
  def put(self, request, id):
        try:
            file_object = Profile.objects.get(user=id)
        except Profile.DoesNotExist:
            return Response({"error": "Profile does not found"}, status=status.HTTP_404_NOT_FOUND)

        file = request.data.get('file')
        serializer = UserProfilePictureSerializer(file_object, data={'profile_picture': file}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# File Create View
class FileCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes =[IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data, instance=request.user)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# File Delete View
class FileDeleteView(generics.DestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'

  
# File Favorite Update View
class FileFavoriteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = File.objects.all()
    serializer_class = FileFavoriteSerializer
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

# File View For Each
class FileSelfView(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'
    
# Only One File Object the First
class FileFirstView(APIView):
    
    def get(self, request):
        file = File.objects.filter(user=request.user).first()
        serializer = FileSerializer(file)
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
