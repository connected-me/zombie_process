pipeline {
  agent {
    label 'docker-node'
  }
  stages {
    stage('Zombie-build'){
      steps{
        container('jnlp'){
          dir("result"){
            sh 'npm install'
          }
        }
      }
    }
    stage('Zombie-Test'){
      steps{
        container('jnlp'){
          dir("result"){
            sh 'npm install'
            sh 'npm test'
          }
        }
      }
    }
    stage('Package with docker'){
      when{
        branch 'main'
      }
      steps{
        container('dockerindocker'){
          echo 'Packaging worker app with docker'
          echo '===========sanity==========='
          sh 'ls -alh ./'
          sh 'whoami'
          sh 'mkdir cacert'
          sh 'cp /cacert/root_ca.crt ./cacert/root_ca.crt'
          sh 'ls -alh ./'
          echo '============================'
          //create docker image
          script{
            docker.withRegistry('https://gitea.1.dev.connected-me.com/homelab','Jenkins-prod') {
              def workerImage = docker.build("gitea.1.dev.connected-me.com/homelab/zombieprocess:v${env.BUILD_ID}", "./")
              workerImage.push()
              workerImage.push("${env.BUILD_ID}")
              workerImage.push("latest")
            }
          }
        }
      }
    }
  }
  post{
    always{
      echo 'Building multibranch pipeline for Zombie_process is completed..'
    }
  }
}