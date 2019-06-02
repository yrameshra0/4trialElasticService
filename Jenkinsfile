pipeline {
    agent any
    environment {
        SWARM_SERVICE_NAME = 'app_movie_search'
    }
    stages {
        stage('Build with unit testing') {
        agent { dockerfile true }
            steps {
                sh """
                node --version
                npm run install
                npm run test
                npm run coverate
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