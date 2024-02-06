#python3 image
FROM python:3
# Provide author name 
#MAINTAINER ...
#preparation
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
COPY . .
#Install all dependencies
RUN pip install --no-cache-dir -r requirements.txt
#launch script
CMD [ "flask","run" ]
#CMD [ "python", "./script.py" ]
EXPOSE 5000
EXPOSE 80
EXPOSE 8080
