#!/usr/bin/env sh
GIT_SYNC_REPO=${GIT_SYNC_REPO:-}
GIT_SYNC_BRANCH=${GIT_SYNC_BRANCH:-}
GIT_SYNC_DEST=${GIT_SYNC_DEST:-}
GIT_SYNC_REV=${GIT_SYNC_REV:-}

mkdir /root/.ssh
echo ${SSH_KEY_DATA} | base64 -d - > /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa


# clone repo
if [ ! -d ${GIT_SYNC_DEST} ]; then
   git clone --no-checkout -b ${GIT_SYNC_BRANCH} ${GIT_SYNC_REPO} ${GIT_SYNC_DEST}
fi

# change to the destination directory
cd ${GIT_SYNC_DEST}
git checkout ${GIT_SYNC_BRANCH}

while true
do
    git pull origin ${GIT_SYNC_BRANCH} &> /dev/null
    sleep 5
done

#
## fetch branch
#git fetch origin ${GIT_SYNC_BRANCH}
#
#
## reset to rev
#if [ ! -z ${GIT_SYNC_REV} ]; then
#    GIT_SYNC_REV='HEAD'
#fi
#
#git reset --hard ${GIT_SYNC_REV}

