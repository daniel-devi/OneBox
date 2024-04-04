from django.contrib.auth.models import User
from core.models import FileActivity,File,Folder
# Restframework
from rest_framework import serializers
    
    
# Create Your Serializer

# User Model Serializer Class {A Api Format of the Model}
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
# Create User Function

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
    
# File Model Serializer Class {A Api Format of the Model}
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id","user","file", "uid", "file_name", "folder", "favorite", "date_created", "date_updated"]
        extra_kwargs = {"date_created": {"read_only": True}, }
    
    def get_file_path(self, obj):
        return obj.file.url
        
        
# Folder Model Serializer Class {A Api Format of the Model}
class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ["user", "uid", "folder_name", "parent_folder", "favorite", "description", "date_created", "date_updated"]
        extra_kwargs = {"date_created": {"read_only": True}, }
        

