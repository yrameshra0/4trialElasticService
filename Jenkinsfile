pipeline {
    agent any
    environment {
        SWARM_SERVICE_NAME = 'app_movie_search'
    }
    stages {
        stage('Running Tests') {
        agent { dockerfile true }
            steps {
                sh """
                export CODECOV_TOKEN="${params.CODECOV_TOKEN}"
                export GIT_COMMIT="$env.GIT_COMMIT"
                node --version
                npm run coverage
                curl -s https://codecov.io/bash>>./codecov.sh
                sh codecov.sh
                """
            }
        }  

        stage('Building Docker Image') {
            steps {
               sh """docker build -t ${env.SWARM_SERVICE_NAME}:${env.GIT_COMMIT} ."""
            }
        }  

        stage('Update TEST swarm') {
            steps {
                 sh """
                docker service update \
                --replicas 1 \
                --update-delay 10s \
                --env-add NODE_ENV=test \
                --image ${env.SWARM_SERVICE_NAME}:${env.GIT_COMMIT} \
                test_${env.SWARM_SERVICE_NAME}
                """
            }
        }    

        stage('Update PROD swarm') {
            steps {
                sh """
                docker service update \
                --replicas 1 \
                --update-delay 10s \
                --env-add NODE_ENV=production \
                --image ${env.SWARM_SERVICE_NAME}:${env.GIT_COMMIT} \
                test_${env.SWARM_SERVICE_NAME}
                """
            }
        }    
    }
}