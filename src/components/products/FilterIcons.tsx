import React from 'react';
import { 
  FrameType, 
  FrameShapeType, 
  FrameBridgeDesignType 
} from '../../types/product.types';
import ShapeRoundIcon from '../icons/Shape/Round';
import ShapeSquareIcon from '../icons/Shape/Square';
import ShapeRectangleIcon from '../icons/Shape/Rectangle';
import ShapeBrowlineIcon from '../icons/Shape/Browline';
import ShapeButterflyIcon from '../icons/Shape/Butterfly';
import ShapeAviatorIcon from '../icons/Shape/Aviator';
import ShapeNarrowIcon from '../icons/Shape/Narrow';
import ShapeOvalIcon from '../icons/Shape/Oval';
import FullRimIcon from '../icons/FrameType/FullRim';
import HalfRimIcon from '../icons/FrameType/HalfRim';
import RimlessIcon from '../icons/FrameType/RimLess';
import KeyHoleIcon from '../icons/BridgeDesign/KeyHole';
import WithNosePadsIcon from '../icons/BridgeDesign/WithNosePads';
import WithoutNosePadsIcon from '../icons/BridgeDesign/WithoutNosePads';

export const shapeIcons: Record<FrameShapeType, React.ReactNode> = {
  [FrameShapeType.ROUND]: <ShapeRoundIcon size={40}/>,
  [FrameShapeType.SQUARE]: <ShapeSquareIcon size={40}/>,
  [FrameShapeType.RECTANGLE]: <ShapeRectangleIcon size={40}/>,
  [FrameShapeType.BROWLINE]: <ShapeBrowlineIcon size={40}/>,
  [FrameShapeType.BUTTERFLY]: <ShapeButterflyIcon size={40}/>,
  [FrameShapeType.AVIATOR]: <ShapeAviatorIcon size={40}/>,
  [FrameShapeType.NARROW]: <ShapeNarrowIcon size={40}/>,
  [FrameShapeType.OVAL]: <ShapeOvalIcon size={40}/>,
};

export const frameTypes: Record<FrameType, React.ReactNode> = {
  [FrameType.FULL_RIM]: <FullRimIcon size={40} />,
  [FrameType.HALF_RIM]: <HalfRimIcon size={40} />,
  [FrameType.RIMLESS]: <RimlessIcon size={40} />,
};

export const bridgeDesigns: Record<FrameBridgeDesignType, React.ReactNode> = {
  [FrameBridgeDesignType.WITH_KEYHOLE_BRIDGE]: <KeyHoleIcon size={40} />,
  [FrameBridgeDesignType.WITH_NOSE_PADS]: <WithNosePadsIcon size={40} />,
  [FrameBridgeDesignType.WITHOUT_NOSE_PADS]: <WithoutNosePadsIcon size={40} />,
};
