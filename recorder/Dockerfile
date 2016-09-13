FROM ubuntu:15.10

RUN apt-get -q update && \
	apt-get -y -q install \
    	automake \
    	build-essential \
    	cmake \
    	curl \
    	gengetopt \
    	git \
    	libavcodec-ffmpeg-dev \
    	libavformat-ffmpeg-dev \
    	libavutil-ffmpeg-dev \
    	libcollection-dev \
    	libcurl4-openssl-dev \
    	libglib2.0-dev \
    	libini-config-dev \
    	libjansson-dev \
    	libnice-dev \
    	libogg-dev \
    	libopus-dev \
    	libsofia-sip-ua-dev \
    	libsrtp-dev \
    	libssl-dev \
    	libtool \
    	openssl \
    	pkg-config && \
    apt-get clean
    
RUN git clone git://git.libwebsockets.org/libwebsockets && \
    cd libwebsockets && \
    mkdir build && \
    cd build && \
    cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr .. && \
    make && make install && \
    cd ../.. && rm -rf libwebsockets

RUN apt-get update && apt-get install -y libmicrohttpd10 libmicrohttpd-dev && apt-get clean

RUN git clone https://github.com/meetecho/janus-gateway.git && \
    cd janus-gateway && \
    sh autogen.sh && \
    ./configure \
    	--disable-docs \
    	--enable-rest \
    	--disable-data-channels \
    	--disable-plugin-voicemail \
    	--disable-plugin-streaming \
    	--disable-plugin-sip \
    	--enable-plugin-recordplay \
    	--enable-post-processing \
    	--disable-rabbitmq && \
    make && \
    make install && \
    make configs && \
    cd .. && rm -rf janus-gateway

EXPOSE 8088

CMD janus -S stun.l.google.com:19302
