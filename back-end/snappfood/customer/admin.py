from django.contrib import admin
from .models import CustomerProfile

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_first_name', 'get_last_name', 'state') 
    search_fields = ('user__phone_number', 'user__first_name', 'user__last_name', 'state')  
    list_editable = ('state',)
    list_filter = ('state',)  
    ordering = ('user__phone_number',)  

    fieldsets = (
        (None, {'fields': ('user', 'state')}),
    )

    @admin.display(description='First Name') 
    def get_first_name(self, obj):
        return obj.user.first_name

    @admin.display(description='Last Name')
    def get_last_name(self, obj):
        return obj.user.last_name

