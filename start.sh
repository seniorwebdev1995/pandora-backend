if [ "$CC_POST_BUILD_HOOK" == '$APP_HOME/clean.sh' ]; then
  node ./main.js
else
  yarn start:watch
fi
