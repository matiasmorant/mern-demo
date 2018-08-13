.PHONY: build

clean:
	rm -rf tmp
	rm -rf build/

run:
	cd backend && gnome-terminal -e "npm start"
	cd frontend && gnome-terminal -e "npm start"
	cd frontend && gnome-terminal -e "npm run-script test"

build: clean
	cd frontend && npm run-script build
	cp -r backend build
	cp -r frontend/build build/build

# add github history to ./build
# push build to github
# push build to heroku
deploy: build
	git clone --no-checkout https://github.com/wvlia5/mern-demo.git tmp && cp -r tmp/. build && rm -rf tmp
	cd build && git add --all && git commit -m "auto-update" || true && git push -u origin master
	rm ~/.netrc && cd build && heroku login && heroku git:remote -a matiasmorant-mern && git push heroku master