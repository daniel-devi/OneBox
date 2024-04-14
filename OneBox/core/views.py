from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
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
from rest_framework.response import Response
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
    
# File Folder Update View
class FileFolderUpdateView(generics.RetrieveUpdateAPIView):
    queryset = File.objects.all()
    serializer_class = FileTrashSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'

    
# File Search View
class FilesSearchView(generics.ListAPIView):
    serializer_class = FileSerializer

    def get_queryset(self):
        search_name = self.kwargs['search']
        return File.objects.filter(file_name__icontains=search_name)
    
# Get Favorite File Views
class FilesSearchFavoriteView(generics.ListAPIView):
    serializer_class = FileSerializer

    def get_queryset(self):
        search_name = self.kwargs['user']
        files = File.objects.filter(user=search_name)
        return files.filter(favorite=True)
    
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
        first_file = file.first()
        serializer = FileSerializer(first_file, many=False)
        return Response(serializer.data, status.HTTP_200_OK)

# File Download View
class FileDownloadView(APIView):
    def get(self, request, uid):
        instance = get_object_or_404(File, uid=uid)
        file_path = instance.file.path
        file_name = instance.file.name.split('/')[-1]
        file_download = open(file_path, 'rb')
        response = FileResponse(file_download)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response

# Folder Create View
class FolderCreateView(generics.CreateAPIView):
    serializer_class = FolderSerializer
    permission_classes = [AllowAny]
    
# Folder Get Model object Trash Folder Api View
class FolderGetTrashView(generics.ListAPIView):
    serializer_class = FolderSerializer
    
    def get_queryset(self):
        search_name = self.kwargs['user']
        folders =  Folder.objects.filter(user=search_name)
        trash_folder = folders.filter(folder_name="Trash")
        return trash_folder

# Folder Api
class FolderGetView(generics.ListAPIView):
    serializer_class = FolderSerializer
    
    def get_queryset(self):
        search_name = self.kwargs['user']
        folders =  Folder.objects.filter(user=search_name)
        return folders

class FolderGetNoTrashView(generics.ListAPIView):
    serializer_class = FolderSerializer
    
    def get_queryset(self):
        search_name = self.kwargs['user']
        folders =  Folder.objects.filter(user=search_name)
        folder_no_trash = folders.exclude(folder_name="Trash")
        return folder_no_trash

# Folder Favorite Update View
class FolderFavoriteUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderFavoriteSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'
    
# Folder Delete Serializer
class FolderDeleteView(generics.DestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uid'

# Folder Filter View
class FolderFilterView(generics.ListAPIView):
    serializer_class = FolderSerializer

    def get_queryset(self):
        search_name = self.kwargs['uid']
        return File.objects.filter(uid=search_name)
    
    
# Folder Search View
class FolderSearchView(generics.ListAPIView):
    serializer_class = FolderSerializer

    def get_queryset(self):
        search_name = self.kwargs['search']
        user_id = self.kwargs['user']
        folder = Folder.objects.filter(folder_name__icontains=search_name, user=user_id)
        return  folder
    
# Get Favorite Folder Views
class FoldersSearchFavoriteView(generics.ListAPIView):
    serializer_class = FolderSerializer

    def get_queryset(self):
        search_name = self.kwargs['user']
        folder = Folder.objects.filter(user=search_name)
        return folder.filter(favorite=True)