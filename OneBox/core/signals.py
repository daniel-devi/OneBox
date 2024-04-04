from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
# Core
from .models import User,Profile,Folder,FileActivity,FolderActivity,File
# External library
import uuid

# Create Your Signals Here 



# Creates a User Profile Once a User is Created
@receiver(post_save, sender=User) 
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Folder.objects.create(user=instance)
        

# Connects Signals to the Model      
post_save.connect(create_profile, sender=User)


# Updates the User Profile On Save
@receiver(post_save, sender=User) 
def save_profile(sender, created, instance, **kwargs):
    if created == True:
        instance.profile.save()

# Connects Signals to the Model      
post_save.connect(save_profile, sender=User)




# Create activity for each file 
@receiver(post_save, sender=File) 
def create_file(sender, instance, created, **kwargs):
    if created:
         FileActivity.objects.create(update='Creation', file=instance)
        

# Connects Signals to the Model      
post_save.connect(create_file, sender=File)


# Updates the File Activity On Save
@receiver(post_save, sender=File) 
def save_file(sender, created, instance, **kwargs):
    if created == True:
        FileActivity.objects.create(update='Edit', file=instance)

# Connects Signals to the Model      
post_save.connect(save_file, sender=File)




# Create activity for each Folder 
@receiver(post_save, sender=Folder) 
def create_folder(sender, instance, created, **kwargs):
    if created:
        FolderActivity.objects.create(update='Creation', folder=instance)
        

# Connects Signals to the Model      
post_save.connect(create_folder, sender=Folder)


# Updates the File Activity On Save
@receiver(pre_save, sender=Folder) 
def save_folder(sender, created, instance, **kwargs):
    if created == True:
        FolderActivity.objects.create(update='Edit', folder=instance)

# Connects Signals to the Model      
post_save.connect(save_folder, sender=Folder)


#
@receiver(pre_save, sender=File)
def modify_model_before_save(sender, instance, **kwargs):
    # Perform modifications to the instance here
    name = instance.file
    instance.file_name = name