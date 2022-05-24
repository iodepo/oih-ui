# Creating
build:
	docker build -t fastapi-docker-base .

run:
	docker run -d -p 8000:8000 --name=fastapi-docker-base fastapi-docker-base

up: build run

# Cleaning
stop:
	docker stop fastapi-docker-base

remove-container:
	docker rm fastapi-docker-base

clean-container: stop remove-container

remove-image:
	docker rmi fastapi-docker-base --force

clean: clean-container remove-image
