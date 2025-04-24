web: python manage.py collectstatic && gunicorn ecommerce.wsgi --log-file - 
#or works good with external database
web: python manage.py migrate && gunicorn ecommerce.wsgi
