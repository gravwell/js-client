FROM ubuntu:focal AS base

FROM gravwell/gravwell:latest AS gravwell-stable

FROM base AS gravwell

RUN apt-get update && apt-get --yes install curl gnupg2 wget
RUN wget -O /usr/share/keyrings/gravwell.asc https://gin.gravwell.io/debianalphaXYZZY/gin.gravwell.io.gpg.key
RUN echo 'deb [ arch=amd64 signed-by=/usr/share/keyrings/gravwell.asc ] https://gin.gravwell.io/debianalphaXYZZY community main' > /etc/apt/sources.list.d/gravwell.list
RUN apt-get update && apt-get --yes install \
  apt-transport-https gravwell

RUN apt-get --yes install gravwell-netflow-capture
RUN apt-get --yes install gravwell-simple-relay

COPY --from=gravwell-stable /opt/gravwell/bin/manager /opt/gravwell/bin/manager

EXPOSE 80
EXPOSE 2055

CMD ["/opt/gravwell/bin/manager"]