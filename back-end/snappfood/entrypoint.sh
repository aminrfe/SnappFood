#!/bin/sh

echo "Waiting for database..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done
echo "Database is ready."

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(phone_number="${DJANGO_SUPERUSER_PHONE_NUMBER}").exists():
    User.objects.create_superuser(
        phone_number="${DJANGO_SUPERUSER_PHONE_NUMBER}",
        password="${DJANGO_SUPERUSER_PASSWORD}"
    )
    print("Superuser created.")
else:
    print("Superuser already exists.")
END

echo "Starting the server..."
exec "$@"
