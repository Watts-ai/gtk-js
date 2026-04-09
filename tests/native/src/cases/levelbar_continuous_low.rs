use relm4::prelude::*;

pub struct LevelbarContinuousLow;

#[relm4::component(pub)]
impl SimpleComponent for LevelbarContinuousLow {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::LevelBar {
            set_value: 0.1,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
