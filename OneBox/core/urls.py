from django.urls import path
# Core
from .views import * 

# Create Urls Here

urlpatterns = [
    path('update_profile/<int:pk>/', UpdateUserView.as_view(), name='auth_update_profile'),
    path('user/details/<int:ids>', UserView.as_view()),
    path('profile/<str:user>', UserProfileView.as_view()),
    path('profile/change',  UserChangeProfileView.as_view()),
    path('file', FileView.as_view() ),
    path('file/first', FileView.as_view() ),
    path('file/create', FileCreateView.as_view()),
    path('file/delete/<uuid:uid>', FileDeleteView.as_view()),
    path('search/file/<str:search>', FilesSearchView.as_view()),
    path('folder', FolderView.as_view() ),
    path('file/create', FileCreateView.as_view() ),
    path('folder/create', FolderCreateView.as_view() ),
]
