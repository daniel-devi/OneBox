from django.contrib import admin
# Core
from core.models import Profile,Folder,File,FileActivity,FolderActivity

# Register your models here.
# Register Models to the Admin Panel

admin.site.register(Profile)
admin.site.register(Folder)
admin.site.register(File)
admin.site.register(FolderActivity)
admin.site.register(FileActivity)

