from django.contrib.auth.models import User
from core.models import FileActivity,File,Folder,Profile
# Restframework
from rest_framework import serializers
    
# Create Your Serializer


# User Model Serializer Class {A Api Format of the Model}
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name", "email", "date_joined"]
        extra_kwargs = {"password": {"write_only": True}, "date_joined": {"read_only": True}}
# Create User Function

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
    
# Update User Profile
class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }
    # Custom validations
    def validate_email(self, value): # Email Validation
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

    # update
    def update(self, instance, validated_data):
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        instance.save()

        return instance

# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta :
        model = Profile
        fields = ["bio","profile_picture"]
    
# User Profile-Pic Serializer
class UserProfilePictureSerializer(serializers.ModelSerializer):
    class Meta :
        model = Profile
        fields = ["profile_picture"]
    
# File Model Serializer Class {A Api Format of the Model}
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["file","id","user", "uid", "file_name", "trash" , "folder", "favorite", "date_created", "date_updated"]
        extra_kwargs = {"date_created": {"read_only": True}, }
    
    def get_file_path(self, obj):
        return obj.file.url


# File Model Favorite Serializer Class
class FileFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["uid", "favorite"]        
        
        
# File Model Trash Serializer Class
class FileTrashSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["uid", "trash"]        
        
        
# Folder Model Serializer Class {A Api Format of the Model}
class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ["user", "uid", "folder_name", "parent_folder", "favorite", "description", "date_created", "date_updated"]
        extra_kwargs = {"date_created": {"read_only": True}, }
        

