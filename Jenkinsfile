pipeline {
    agent none

    environment {
        IMAGE_NAME = 'histolingo-admin-be'
        CONTAINER_NAME = 'histolingo-admin-be'
    }

    stages {
        stage('Remove old version') {
            steps {
                echo "Stopping container ${CONTAINER_NAME}"
                sh "(docker stop ${CONTAINER_NAME} &>/dev/null) || true"

                echo "Removing container ${CONTAINER_NAME}"
                sh "(docker rm ${CONTAINER_NAME} &>/dev/null) || true"

                echo "Removing image ${IMAGE_NAME}"
                sh "(docker image rm ${IMAGE_NAME} &>/dev/null) || true"
            }
        }
        stage('Deploy new version') {
           steps {
                echo "Docker compose up for ${IMAGE_NAME}"
                sh "docker compose up"
            }
        }
    }
}