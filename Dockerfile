#FROM node:6.3.1
#ADD package.json /app/package.json
#WORKDIR /app
#RUN npm install && npm install -g forever
#COPY . /app
#CMD node index.js

FROM alpine:3.2

ENV LFS_VERSION 1.0.2
ENV GIT_SYNC_BRANCH master


RUN apk add --update git openssh
RUN apk add --update --virtual build-dependencies curl && \
    curl -sLO https://github.com/github/git-lfs/releases/download/v${LFS_VERSION}/git-lfs-linux-amd64-${LFS_VERSION}.tar.gz && \
    tar xzf /git-lfs-linux-amd64-${LFS_VERSION}.tar.gz -C / && \
    mv /git-lfs-${LFS_VERSION}/git-lfs /usr/local/bin/ && \
    git-lfs init && \
    apk del build-dependencies && \
    rm -rf /git-lfs-${LFS_VERSION} && \
    rm -rf /git-lfs-linux-amd64-${LFS_VERSION}.tar.gz && \
    rm -rf /var/cache/apk/*
ADD ssh_config /etc/ssh/ssh_config
COPY git-sync.sh /
RUN chmod +x /git-sync.sh

#CMD /bin/sh
ENTRYPOINT ["/git-sync.sh"]