from django.urls import path
# Core
from .views import * 

# Create Urls Here

urlpatterns = [
    path('update_profile/<int:pk>/', UpdateUserView.as_view()),
    path('user/details/<int:ids>', UserView.as_view()),
    path('profile/<str:user>', UserProfileView.as_view()),
    path('profile/change/<int:id>',  UserChangeProfileView.as_view()),
    path('file', FileView.as_view() ),
    path('file/first', FileView.as_view() ),
    path('file/create', FileCreateView.as_view()),
    path('file/update/trash/<uuid:uid>', FileFolderUpdateView.as_view()),
    path('file/update/favorite/<uuid:uid>', FileFavoriteUpdateView.as_view()),
    path('file/favorite/<int:user>', FilesSearchFavoriteView.as_view()),
    path('file/share/<uuid:uid>', FileSelfView.as_view()),
    path('file/delete/<uuid:uid>', FileDeleteView.as_view()),
    path('file/download/<uuid:uid>', FileDownloadView.as_view()),
    path('search/file/<str:search>', FilesSearchView.as_view()),
    path('folder/trash/<int:user>', FolderGetTrashView.as_view() ),
    path('folder/<int:user>', FolderGetView.as_view() ),
    path('folder/no-trash/<int:user>', FolderGetNoTrashView.as_view() ),
    path('folder/create', FolderCreateView.as_view() ),
    path('folder/update/favorite/<uuid:uid>', FolderFavoriteUpdateView.as_view()),
    path('folder/delete/<uuid:uid>', FolderDeleteView.as_view()),
    path('folder/file-filter/<uuid:uid>', FolderFilterView.as_view()),
    path('search/folder/<str:search>/<int:user>/', FolderSearchView.as_view()),
    path('folder/favorite/<int:user>', FoldersSearchFavoriteView.as_view()),
    
]
