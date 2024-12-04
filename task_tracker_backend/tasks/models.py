from django.db import models

class Task(models.Model):
    name = models.CharField(max_length=255)
    due_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    completed = models.BooleanField(default=False)  

    def __str__(self):
        return self.name

