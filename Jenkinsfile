pipeline {
    agent any
    environment {
        SWARM_SERVICE_NAME = 'app_movie_search'
    }
    stages {
        stage('Build with unit testing') {
        agent { 
                docker { image 'node:12-alpine' }
            }
            steps {
                sh """
                node --version
                npm run test
                npm run coverate
                docker build -t ${env.SWARM_SERVICE_NAME}:${env.GIT_COMMIT} .
                """
            }
        }  

        stage('Update TEST swarm') {
            steps {
                sh """
                echo "PENDING STEPS"
                """
            }
        }    

        stage('Update PROD swarm') {
            steps {
                sh """
                echo "PENDING STEPS"
                """
            }
        }    
    }
}