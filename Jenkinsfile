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
                echo "CODECOV_TOKEN=${params.CODECOV_TOKEN}"
                node --version
                npm run coverage
                """
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