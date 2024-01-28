from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    comment_add_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    class Meta:
        model = Comment
        fields = ['user_name', 'comment_text', 'comment_add_date']

    def get_user_name(self, obj):
        return obj.user_id.username if obj.user_id else None