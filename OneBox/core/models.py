from typing import Iterable
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# importing uuid 
import uuid 
# Import from Pillow
from PIL import Image

# Create your models here.
    
# A Profile Model

def user_profile_image_directory_path(instance, filename): ## Profile Save Directory
    # file will be uploaded to MEDIA_ROOT/user_name/<filename>
    return "Profile-Images/user_{0}/{1}".format(instance.user.username, filename)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to=user_profile_image_directory_path, default='default/image.png', null=True, blank=True)
    bio = models.CharField(max_length=450, blank=True, null=True)

    # Return the Name of Each Object as {User-Username} Profile
    def __str__(self):
        return f"{self.user} Profile"
 
    def save(self, *args, **kwargs):
        # save the profile first
        super().save(*args, **kwargs)

        # resize the image
        img = Image.open(self.avatar.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            # create a thumbnail
            img.thumbnail(output_size)
            # overwrite the larger image
            img.save(self.avatar.path)
            
# A Folder Model
class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    uid = models.UUIDField(editable=True, default=uuid.uuid4, unique=True)
    folder_name = models.CharField(max_length=255 ,default="My OneBox",)
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    favorite = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=timezone.now, editable=False)
    date_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.user} {self.folder_name}"
    

        
# File Model  
def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_name/<filename>
    return "User_Files/user_{0}/{1}".format(instance.user.username, filename)

def file_name(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_name/<filename>
    return f"{filename}"

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    uid = models.UUIDField(editable=True, default=uuid.uuid4, unique=True)
    file_name = models.CharField(max_length=255, blank=True, null=True,)
    file = models.FileField(upload_to=user_directory_path)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)
    favorite = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=timezone.now, editable=False)
    date_updated = models.DateTimeField(auto_now=True)

    
    def __str__(self) -> str:
        return f"{self.user} {self.file_name}"
        
    @property
    def file_path(self):
        self.file.url
    
    
# File Activity Model   
class FileActivity(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE,null=True, blank=True)
    update = models.CharField(max_length=50)
    date = models.DateTimeField(auto_now=True, editable=False)
    
    def __str__(self) -> str:
        return f"{self.file} == {self.update} /{self.date}"
  
# Folder Activity Model  
class FolderActivity(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE,null=True, blank=True)
    update = models.CharField(max_length=50)
    date = models.DateTimeField(auto_now=True, editable=False)
    
    def __str__(self) -> str:
        return f"{self.folder} == {self.update} /{self.date}"
    