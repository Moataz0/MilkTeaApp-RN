import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, Animated, Image } from 'react-native';
import { CustomButton, HeaderBar } from '../components';
import { COLORS, SIZES, constants, images, icons, dummyData, FONTS } from '../constants';
import { connect } from 'react-redux';


const promoTabs = constants.promoTabs.map((promoTab) => ({
  ...promoTab,
  ref: React.createRef()
}))

const TabIndicator = ({ measureLayout, scrollX }) => {

  const inputRange = promoTabs.map((_, i) => i * SIZES.width)
  const TabIndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.width)
  })
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x)
  })
  return (
    <Animated.View

      style={{
        position: "absolute",
        height: "100%",
        width: TabIndicatorWidth,
        left: 0,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        transform: [{
          translateX
        }]
      }} />


  )
}
const Tabs = ({ appTheme, scrollX, onPromoTabPress }) => {

  const [measureLayout, setMagureLayout] = React.useState([])
  const containerRef = React.useRef()
  const tabPosition = Animated.divide(scrollX, SIZES.width)

  React.useEffect(() => {
    let ml = []
    promoTabs.forEach(promo => {
      promo.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          console.log(x, y, width, height);
          ml.push({
            x, y, width, height
          })
          if (ml.length === promoTabs.length) {
            setMagureLayout(ml)
          }
        }
      )
    })
  }, [containerRef.current])


  return (
    <View
      ref={containerRef}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: SIZES.padding,
        backgroundColor: appTheme.tabBackgroundColor,
        borderRadius: SIZES.radius
      }}>
      {/* Tab Indicator */}
      {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />}

      {/* Tabs */}
      {promoTabs.map((item, index) => {
        const textColor = tabPosition.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [COLORS.lightGray2, COLORS.white, COLORS.lightGray2],
          extrapolate: "clamp"
        })
        return (
          <TouchableOpacity

            key={`PromoTab-${index}`}
            onPress={() => onPromoTabPress(index)}
          >
            <View
              ref={item.ref}
              style={{
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
                height: 40
              }}>
              <Animated.Text style={{ color: textColor, ...FONTS.h3 }}>{item.title}</Animated.Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
const Home = ({ navigation, appTheme }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const promoScrollViewRef = React.useRef()

  const onPromoTabPress = React.useCallback(promTabIndex => {
    promoScrollViewRef?.current?.scrollToOffset({
      offset: promTabIndex * SIZES.width
    })
  })
  function renderAvailableRewards() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding,
          height: 100
        }}
        onPress={() => navigation.navigate("Rewards")}
      >
        {/* Reward Cup */}
        <View style={{
          width: 100,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.pink,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15
        }}>
          <ImageBackground
            source={icons.reward_cup}
            resizeMode='contain'
            style={{
              width: 85,
              height: 85,
              marginLeft: 3,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.transparentBlack
            }}>
              <Text style={{ color: COLORS.white, ...FONTS.h4 }}>558</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: COLORS.lightPink,
          marginLeft: -10,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Text style={{ color: COLORS.primary, ...FONTS.h2, fontSize: 20 }}>Available Rewards</Text>
          <View style={{
            marginTop: 5,
            padding: SIZES.base,
            borderRadius: SIZES.radius * 2,
            backgroundColor: COLORS.primary
          }}>
            <Text style={{ color: COLORS.white, ...FONTS.body3 }}>150 points - $2.50 off</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  function renderPromoDeals() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {/* Header , Tabs */}
        <Tabs
          appTheme={appTheme}
          scrollX={scrollX}
          onPromoTabPress={onPromoTabPress}
        />
        {/* Details */}
        <Animated.FlatList
          ref={promoScrollViewRef}
          data={dummyData.promos}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: scrollX } } }
          ],
            { useNativeDriver: false }
          )}
          renderItem={({ item, index }) => {
            return (
              <View style={{
                flex: 1,
                alignItems: "center",
                width: SIZES.width,

              }}>
                {/* Image */}
                <Image
                  source={images.strawberryBackground}
                  resizeMode='contain'
                  style={{ width: "100%", }}
                />
                {/* Name */}
                <Text style={{ color: COLORS.red, ...FONTS.h2, marginTop: -15 }}>{item.name}</Text>
                {/* Description */}
                <Text style={{ color: appTheme.textColor, ...FONTS.body4 }}>{item.description}</Text>
                {/* Calories */}
                <Text style={{ color: appTheme.textColor, ...FONTS.body4 }}>{item.calories}</Text>
                {/* Button */}
                <CustomButton
                  label="Order Now"
                  isPrimaryButton={true}
                  containerStyle={{
                    marginTop: 5,
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.base,
                    borderRadius: SIZES.radius * 2,

                  }}
                  labelStyle={{ ...FONTS.h3 }}
                  onPress={() => navigation.navigate("Location")}
                />
              </View>
            )
          }}
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <HeaderBar />
      <ScrollView
        style={{
          flex: 1,
          marginTop: -80,
          borderTopLeftRadius: SIZES.radius * 2,
          borderTopRightRadius: SIZES.radius * 2,
          backgroundColor: appTheme.backgroundColor,
        }}
        contentContainerStyle={{
          paddingBottom: 150
        }}
      >
        {/* Rewards */}
        {renderAvailableRewards()}
        {/* Promo */}
        {renderPromoDeals()}
      </ScrollView>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    appTheme: state.appTheme,
    error: state.error,
  };
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
